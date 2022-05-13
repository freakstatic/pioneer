import { ApiRx } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'

import { ClientQueryMessage, WorkerQueryMessage } from './client/api-query'
import { ClientTxMessage, WorkerTxMessage } from './client/api-tx'
import { ClientProxyMessage, WorkerProxyMessage } from './models/payload'

export type TransactionsRecord = Record<string, SubmittableExtrinsic<'rxjs'>>

export type PostMessage<Message extends AnyMessage = AnyMessage> = (message: Message) => void

export type ApiKinds = 'derive' | 'query' | 'rpc' | 'tx'

export type RawWorkerMessageEvent = MessageEvent<{
  messageType: WorkerMessage['messageType']
  payload?: any
}>

export type RawClientMessageEvent = MessageEvent<{
  messageType: ClientMessage['messageType']
  payload?: any
}>

export type RawMessageEvent = RawWorkerMessageEvent | RawClientMessageEvent

export type WorkerInitMessage = { messageType: 'init'; payload: { consts: ApiRx['consts'] } }
export type ClientInitMessage = { messageType: 'init'; payload: string }
export type WorkerConnectMessage = { messageType: 'isConnected'; payload: boolean }

export type WorkerMessage =
  | WorkerInitMessage
  | WorkerConnectMessage
  | WorkerQueryMessage
  | WorkerTxMessage
  | WorkerProxyMessage

export type ClientMessage = ClientInitMessage | ClientQueryMessage | ClientTxMessage | ClientProxyMessage

export type AnyMessage = WorkerMessage | ClientMessage
