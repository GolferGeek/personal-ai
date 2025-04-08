import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorDisplay } from "../ErrorDisplay";

describe("ErrorDisplay", () => {
  it("renders the error message", () => {
    const errorMessage = "Something went wrong!";
    render(<ErrorDisplay errorMessage={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument(); // Default title
  });

  it("renders with a custom title", () => {
    const errorMessage = "Network connection lost";
    const customTitle = "Connection Error";
    render(<ErrorDisplay errorMessage={errorMessage} title={customTitle} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.queryByText("Error")).not.toBeInTheDocument(); // Default title should not be present
  });

  it("applies the correct styling", () => {
    render(<ErrorDisplay errorMessage="Test error" />);

    // Check that it's using MUI Alert with error severity
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass("MuiAlert-standardError"); // This class is applied by MUI for error alerts
  });
});
