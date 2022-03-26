import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { Async } from ".";

describe("Async component", () => {
  it('renders correctly', async () => {
    render(<Async/>);

    expect(screen.getByText('Hello world')).toBeInTheDocument();
  
    await waitForElementToBeRemoved(screen.queryByText('Button'));
  });
})