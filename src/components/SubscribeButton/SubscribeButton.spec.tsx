import { fireEvent, render, screen } from "@testing-library/react"
import { SubscribeButton } from "."
import { mocked } from "jest-mock"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/router"

jest.mock('next-auth/react')
jest.mock('next/router')

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'loading'
    })

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when is not authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'loading'
    })

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already has an subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)

    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: { 
        user: { name: 'John Doe', email: 'jdoe@example.com' }, 
        expires: 'fake-expires', 
        activeSubscription: 'fake-subscription'
      },
      status: 'authenticated'
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton />)

    const subscriptionButton = screen.getByText('Subscribe now')

    fireEvent.click(subscriptionButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})