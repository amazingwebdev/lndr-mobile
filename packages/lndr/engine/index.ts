// This file is over 50 lines and needs to be split up

import ethUtil from 'ethereumjs-util'

import { longTimePeriod } from 'lndr/time'
import User, { CreateAccountData, RecoverAccountData, LoginAccountData, UpdateAccountData } from 'lndr/user'
import Friend from 'lndr/friend'

import CreditProtocol from 'credit-protocol'

import Storage from 'lndr/storage'

import { accountManagement } from 'language'

const mnemonicStorage = new Storage('mnemonic')
const hashedPasswordStorage = new Storage('hashed-password')

export const PASSWORD_SALT = 'THIS_IS_A_SALT_5426892348596723645879243876'

const creditProtocol = new CreditProtocol('http://34.202.214.156')

export interface EngineState {
  user?: User,
  isInitializing?: boolean
  hasStoredUser?: boolean
  shouldRecoverAccount?: boolean
  shouldRemoveAccount?: boolean
  shouldConfirmAccount?: boolean
  mnemonicInstance?: any
  password?: string
  errorMessage?: string
  successMessage?: string
}

interface EngineStateListener {
  (engineState: EngineState): void
}

export default class Engine {
  engineState: EngineState
  listeners: EngineStateListener[]
  clearErrorTimeout: number
  clearSuccessTimeout: number
  privateKeyBuffer: any

  constructor() {
    this.listeners = []
    this.engineState = {
      hasStoredUser: false,
      shouldRecoverAccount: false,
      shouldRemoveAccount: false,
      shouldConfirmAccount: false
    }
  }

  async initialize() {
    this.state = { isInitializing: true }
    const storedMnemonic = await mnemonicStorage.get()
    if (storedMnemonic) {
      this.state = { hasStoredUser: true }
    }
    this.state = { isInitializing: false }
  }

  subscribe(listener: EngineStateListener) {
    this.listeners.push(listener)
  }

  get state(): EngineState {
    return { ...this.engineState }
  }

  set state(state) {
    this.engineState = { ...this.engineState, ...state }
    this.listeners.forEach(listener => listener(state))
  }

  clearError() {
    this.state = { errorMessage: undefined }
  }

  setErrorMessage(errorMessage) {
    this.state = { errorMessage }
    clearTimeout(this.clearErrorTimeout)
    this.clearErrorTimeout = setTimeout(() => this.clearError(), longTimePeriod)
  }

  clearSuccess() {
    this.state = { successMessage: undefined }
  }

  setSuccessMessage(successMessage) {
    this.state = { successMessage }
    clearTimeout(this.clearSuccessTimeout)
    this.clearErrorTimeout = setTimeout(() => this.clearSuccess(), longTimePeriod)
  }

  createAccount(accountData: CreateAccountData) {
    if (accountData.password.length < 8) {
      return this.setErrorMessage(accountManagement.password.lengthViolation)
    }
    if (accountData.password !== accountData.confirmPassword) {
      return this.setErrorMessage(accountManagement.password.matchViolation)
    }

    const password = accountData.password
    const mnemonicInstance = creditProtocol.getRandomMnemonic()
    this.state = { shouldConfirmAccount: true, password, mnemonicInstance }
  }

  async getAccountInformation() {
    const { address } = this.engineState.user as User
    const nickname = await creditProtocol.getNickname(address)
    return { nickname }
  }

  async updateAccount(accountData: UpdateAccountData) {
    const { address, privateKeyBuffer } = this.engineState.user as User
    const { nickname } = accountData

    try {
      await creditProtocol.setNickname(address, nickname, privateKeyBuffer)
      this.setSuccessMessage(accountManagement.setNickname.success)
    } catch (error) {
      this.setErrorMessage(accountManagement.setNickname.error)
      throw error
    }
  }

  async addFriend(friend: Friend) {
    const { address, privateKeyBuffer } = this.engineState.user as User
    try {
      await creditProtocol.addFriend(address, friend.address, privateKeyBuffer)
      this.setSuccessMessage(accountManagement.addFriend.success(friend.nickname))
    } catch (error) {
      this.setErrorMessage(accountManagement.addFriend.error)
      throw error
    }
  }

  async removeFriend(friend: Friend) {
    const { address, privateKeyBuffer } = this.engineState.user as User
    try {
      await creditProtocol.removeFriend(address, friend.address, privateKeyBuffer)
      this.setSuccessMessage(accountManagement.removeFriend.success(friend.nickname))
    } catch (error) {
      this.setErrorMessage(accountManagement.removeFriend.error)
      throw error
    }
  }

  jsonToFriend(data) {
    let addr, nick
    if (typeof data === 'string') {
      addr = data
      nick = addr.substr(2, 8)
    }
    else {
      addr = data.addr
      nick = data.nick || addr.substr(2, 8)
    }
    return new Friend(addr, nick)
  }

  async getFriends() {
    const { address } = this.engineState.user as User
    const friends = await creditProtocol.getFriends(address)
    return friends.map(this.jsonToFriend)
  }

  async searchUsers(searchData) {
    const { nickname } = searchData
    const users = await creditProtocol.searchUsers(nickname)
    return users.map(this.jsonToFriend)
  }

  cancelConfirmAccount() {
    this.state = { shouldConfirmAccount: false }
  }

  createUserFromCredentials(mnemonicInstance, password) {
    const mnemonic = mnemonicInstance.toString()
    const hashedPassword = Array.from(mnemonicInstance.toSeed(PASSWORD_SALT + password)).join('.')
    const privateKey = mnemonicInstance.toHDPrivateKey(password)
    const privateKeyBuffer = privateKey.privateKey.toBuffer()
    const ethAddress = ethUtil.privateToAddress(privateKeyBuffer)
    const address = ethUtil.bufferToHex(ethAddress)

    return new User(
      mnemonic,
      hashedPassword,
      privateKey,
      privateKeyBuffer,
      ethAddress,
      address
    )
  }

  async storeUserSession(user: User) {
    await mnemonicStorage.set(user.mnemonic)
    await hashedPasswordStorage.set(user.hashedPassword)
  }

  async confirmAccount() {
    const { password, mnemonicInstance } = this.state
    const user = this.createUserFromCredentials(mnemonicInstance, password)
    await this.storeUserSession(user)
    this.state = { user, hasStoredUser: true, shouldConfirmAccount: false }
  }

  async loginAccount(loginData: LoginAccountData) {
    const { confirmPassword } = loginData
    const mnemonic = await mnemonicStorage.get()
    const mnemonicInstance = creditProtocol.getMnemonic(mnemonic)
    const hashedPasswordReference = await hashedPasswordStorage.get()
    const hashedPassword = Array.from(mnemonicInstance.toSeed(PASSWORD_SALT + confirmPassword)).join('.')
    
    if (hashedPassword !== hashedPasswordReference) {
      return this.setErrorMessage(accountManagement.password.failedHashComparison)
    }

    const user = this.createUserFromCredentials(mnemonicInstance, confirmPassword)
    this.state = { user, hasStoredUser: true }
  }

  async recoverAccount(recoverData: RecoverAccountData) {
    const { confirmPassword, mnemonic } = recoverData

    if (mnemonic.split(' ').length < 12) {
      return this.setErrorMessage(accountManagement.mnemonic.lengthViolation)
    }

    if (confirmPassword.length < 8) {
      return this.setErrorMessage(accountManagement.password.lengthViolation)
    }

    try {
      const mnemonicInstance = creditProtocol.getMnemonic(mnemonic.toLowerCase())
      this.state = { password: confirmPassword, mnemonicInstance }
      await this.confirmAccount()
    }

    catch (e) {
      return this.setErrorMessage(accountManagement.mnemonic.unableToValidate)
    }
  }

  async removeAccount() {
    await mnemonicStorage.remove()
    await hashedPasswordStorage.remove()
    this.state = { hasStoredUser: false, shouldRemoveAccount: false }
  }

  goToRecoverAccount() {
    this.state = { shouldRecoverAccount: true }
  }

  cancelRecoverAccount() {
    this.state = { shouldRecoverAccount: false }
  }

  goToRemoveAccount() {
    this.state = { shouldRemoveAccount: true }
  }

  cancelRemoveAccount() {
    this.state = { shouldRemoveAccount: false }
  }
}
