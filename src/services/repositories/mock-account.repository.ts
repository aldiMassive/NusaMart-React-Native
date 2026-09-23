import { mockCurrentUser } from '@/mocks/account'
import { AccountRepository } from '@/services/repositories/contracts'
import { withLatency } from '@/utils/async'

export class MockAccountRepository implements AccountRepository {
  getCurrentUser() {
    return withLatency({ ...mockCurrentUser })
  }
}
