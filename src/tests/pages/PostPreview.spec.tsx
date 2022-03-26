import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic");

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>New post content</p>',
  updatedAt: '26 de março de 2022'
};

describe("PostPreview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'loading'    
    });

    render(<PostPreview post={post}/>);

    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('New post content')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it("redirects to full post when user is subscribed", () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: { activeSubscription: 'fake-active-subscription' }      
    } as any);
    
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    render(<PostPreview post={post}/>);

    expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`);
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'My new post' }],
          content: [{ type: 'paragraph', text: 'New post content' }],
        },
        last_publication_date: '03-26-2022'
      })
    } as any);

    const response = await getStaticProps({ params: { slug: 'my-new-post' } });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>New post content</p>',
            updatedAt: '26 de março de 2022'
          }
        }
      })
    )
  })
})