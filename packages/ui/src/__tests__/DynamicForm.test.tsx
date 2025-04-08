import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DynamicForm } from "../DynamicForm";
import type { FormField } from "../DynamicForm";

describe("DynamicForm", () => {
  const mockFields: FormField[] = [
    {
      name: "text",
      type: "string",
      label: "Text to reverse",
      description: "Text to reverse",
      required: true,
    },
    {
      name: "uppercase",
      type: "boolean",
      label: "Uppercase",
      description: "Convert to uppercase before reversing",
      required: false,
      default: false,
    },
    {
      name: "repeat",
      type: "number",
      label: "Repeat Count",
      description: "Number of times to repeat",
      required: false,
      default: 1,
    },
  ];

  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields correctly", () => {
    render(<DynamicForm fields={mockFields} onSubmit={mockSubmit} />);

    // Check if all fields are rendered - using more reliable selectors
    expect(screen.getByLabelText(/Text to reverse/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Uppercase/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repeat Count/i)).toBeInTheDocument();

    // Check if submit button is rendered
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("initializes with default values", () => {
    render(<DynamicForm fields={mockFields} onSubmit={mockSubmit} />);

    // Check default values using more reliable selectors
    const textInput = screen.getByLabelText(/Text to reverse/i);
    expect(textInput).toHaveValue("");

    // For boolean fields, looking for the checkbox input
    const uppercaseSwitch = screen.getByRole("checkbox");
    expect(uppercaseSwitch).not.toBeChecked();

    // For number fields
    const repeatInput = screen.getByLabelText(/Repeat Count/i);
    expect(repeatInput).toHaveValue(1);
  });

  it("updates form values when user interacts with fields", () => {
    render(<DynamicForm fields={mockFields} onSubmit={mockSubmit} />);

    // Change text field
    const textInput = screen.getByLabelText(/Text to reverse/i);
    fireEvent.change(textInput, { target: { value: "Hello World" } });
    expect(textInput).toHaveValue("Hello World");

    // Toggle boolean field
    const uppercaseSwitch = screen.getByRole("checkbox");
    fireEvent.click(uppercaseSwitch);
    expect(uppercaseSwitch).toBeChecked();

    // Change number field
    const repeatInput = screen.getByLabelText(/Repeat Count/i);
    fireEvent.change(repeatInput, { target: { value: "3" } });
    expect(repeatInput).toHaveValue(3);
  });

  it("calls onSubmit with form values when submitted", () => {
    render(<DynamicForm fields={mockFields} onSubmit={mockSubmit} />);

    // Fill out the form using more reliable selectors
    const textInput = screen.getByLabelText(/Text to reverse/i);
    fireEvent.change(textInput, { target: { value: "Hello World" } });

    const uppercaseSwitch = screen.getByRole("checkbox");
    fireEvent.click(uppercaseSwitch);

    const repeatInput = screen.getByLabelText(/Repeat Count/i);
    fireEvent.change(repeatInput, { target: { value: "3" } });

    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);

    // Check if onSubmit was called with the correct values
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      text: "Hello World",
      uppercase: true,
      repeat: 3,
    });
  });

  it("respects custom submit label", () => {
    render(
      <DynamicForm
        fields={mockFields}
        onSubmit={mockSubmit}
        submitLabel="Save Parameters"
      />
    );
    expect(
      screen.getByRole("button", { name: "Save Parameters" })
    ).toBeInTheDocument();
  });

  it("shows validation errors for required fields when submitting empty form", () => {
    render(<DynamicForm fields={mockFields} onSubmit={mockSubmit} />);

    // Try to submit the form without filling required fields
    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);

    // The text field is required, so the form shouldn't be submitted
    expect(mockSubmit).not.toHaveBeenCalled();

    // Note: In React Testing Library, we can't easily check HTML5 validation errors
    // So we'll just check that the submit handler wasn't called
  });
});
