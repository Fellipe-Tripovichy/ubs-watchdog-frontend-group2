import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewTransactionPage from "@/app/transactions/new-transaction/page";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/lib/hooks";
import { clearClient } from "@/features/client/clientSlice";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/hooks", () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock("@/features/client/clientSlice", () => ({
  clearClient: jest.fn(),
}));

jest.mock("@/components/ui/linkButton", () => ({
  LinkButton: ({ children, onClick, className }: any) => (
    <button
      data-slot="button"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/heroTitle", () => ({
  HeroTitle: ({ children, subtitle, as }: any) => (
    <div>
      <h1>{children}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  ),
}));

jest.mock("@/components/ui/tabs", () => {
  const React = require("react");
  
  const Tabs = ({ children, defaultValue, onValueChange, className }: any) => {
    const [value, setValue] = React.useState(defaultValue);
    
    const handleValueChange = (newValue: string) => {
      setValue(newValue);
      onValueChange?.(newValue);
    };
    
    return (
      <div data-testid="tabs" data-value={value} className={className}>
        {React.Children.map(children, (child: any) => {
          if (child?.type?.displayName === "TabsList") {
            return React.cloneElement(child, { value, onValueChange: handleValueChange });
          }
          if (child?.type?.displayName === "TabsContent") {
            return React.cloneElement(child, { currentValue: value });
          }
          return child;
        })}
      </div>
    );
  };
  
  Tabs.displayName = "Tabs";
  
  const TabsList = ({ children, value, onValueChange }: any) => {
    return (
      <div data-testid="tabs-list">
        {React.Children.map(children, (child: any) => {
          return React.cloneElement(child, {
            onClick: () => onValueChange(child.props.value),
            "data-active": value === child.props.value,
          });
        })}
      </div>
    );
  };
  
  TabsList.displayName = "TabsList";
  
  const TabsTrigger = ({ children, value, onClick, "data-active": active }: any) => (
    <button
      data-testid={`tab-${value}`}
      onClick={onClick}
      data-active={active}
    >
      {children}
    </button>
  );
  
  TabsTrigger.displayName = "TabsTrigger";
  
  const TabsContent = ({ children, value, currentValue, className }: any) => {
    if (currentValue === value) {
      return (
        <div data-testid={`tab-content-${value}`} className={className}>
          {children}
        </div>
      );
    }
    return null;
  };
  
  TabsContent.displayName = "TabsContent";
  
  return {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  };
});

jest.mock("@/components/transactions/transactionForm", () => ({
  TransactionForm: ({ type, onTransactionResult }: any) => (
    <div data-testid={`transaction-form-${type}`}>
      <button
        data-testid={`form-success-${type}`}
        onClick={() => onTransactionResult(true, undefined)}
      >
        Success
      </button>
      <button
        data-testid={`form-error-${type}`}
        onClick={() => onTransactionResult(false, "Error message")}
      >
        Error
      </button>
    </div>
  ),
}));

jest.mock("@/components/transactions/transactionFeedback", () => ({
  TransactionFeedback: ({ type, isSuccess, errorMessage, onReset }: any) => (
    <div data-testid={`transaction-feedback-${type}`} data-success={isSuccess}>
      <div data-testid="feedback-message">{errorMessage}</div>
      <button data-testid="feedback-reset" onClick={onReset}>
        Reset
      </button>
    </div>
  ),
}));

describe("NewTransactionPage", () => {
  const mockDispatch = jest.fn();
  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    (clearClient as unknown as jest.Mock).mockReturnValue({
      type: "client/clearClient",
    });
  });

  it("renders correctly", () => {
    render(<NewTransactionPage />);

    expect(screen.getByText("Nova Transação")).toBeInTheDocument();
    expect(screen.getByText("Trasnferência, depósito ou saque")).toBeInTheDocument();
  });

  it("renders tabs correctly", () => {
    render(<NewTransactionPage />);

    expect(screen.getByTestId("tab-transferencia")).toBeInTheDocument();
    expect(screen.getByTestId("tab-deposito")).toBeInTheDocument();
    expect(screen.getByTestId("tab-saque")).toBeInTheDocument();
  });

  it("renders transferencia form by default", () => {
    render(<NewTransactionPage />);

    expect(screen.getByTestId("transaction-form-Transferencia")).toBeInTheDocument();
  });

  it("calls clearClient on mount", () => {
    render(<NewTransactionPage />);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "client/clearClient",
      })
    );
  });

  it("calls router.back when Voltar button is clicked", () => {
    render(<NewTransactionPage />);

    const backButton = screen.getByText("Voltar");
    fireEvent.click(backButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("switches to deposito tab", () => {
    render(<NewTransactionPage />);

    const depositoTab = screen.getByTestId("tab-deposito");
    fireEvent.click(depositoTab);

    expect(screen.getByTestId("transaction-form-Deposito")).toBeInTheDocument();
    expect(screen.queryByTestId("transaction-form-Transferencia")).not.toBeInTheDocument();
  });

  it("switches to saque tab", () => {
    render(<NewTransactionPage />);

    const saqueTab = screen.getByTestId("tab-saque");
    fireEvent.click(saqueTab);

    expect(screen.getByTestId("transaction-form-Saque")).toBeInTheDocument();
    expect(screen.queryByTestId("transaction-form-Transferencia")).not.toBeInTheDocument();
  });

  it("calls clearClient when tab changes", () => {
    render(<NewTransactionPage />);

    mockDispatch.mockClear();

    const depositoTab = screen.getByTestId("tab-deposito");
    fireEvent.click(depositoTab);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "client/clearClient",
      })
    );
  });

  it("resets transaction result when tab changes", () => {
    render(<NewTransactionPage />);

    const form = screen.getByTestId("transaction-form-Transferencia");
    const successButton = screen.getByTestId("form-success-Transferencia");
    fireEvent.click(successButton);

    expect(screen.getByTestId("transaction-feedback-Transferencia")).toBeInTheDocument();

    const depositoTab = screen.getByTestId("tab-deposito");
    fireEvent.click(depositoTab);

    expect(screen.queryByTestId("transaction-feedback-Transferencia")).not.toBeInTheDocument();
    expect(screen.getByTestId("transaction-form-Deposito")).toBeInTheDocument();
  });

  it("resets form when tab changes", () => {
    render(<NewTransactionPage />);

    const initialForm = screen.getByTestId("transaction-form-Transferencia");
    expect(initialForm).toBeInTheDocument();

    const depositoTab = screen.getByTestId("tab-deposito");
    fireEvent.click(depositoTab);

    const newForm = screen.getByTestId("transaction-form-Deposito");
    expect(newForm).toBeInTheDocument();
    expect(screen.queryByTestId("transaction-form-Transferencia")).not.toBeInTheDocument();
  });

  it("shows success feedback for Transferencia", () => {
    render(<NewTransactionPage />);

    const successButton = screen.getByTestId("form-success-Transferencia");
    fireEvent.click(successButton);

    expect(screen.getByTestId("transaction-feedback-Transferencia")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-feedback-Transferencia")).toHaveAttribute(
      "data-success",
      "true"
    );
  });

  it("shows error feedback for Transferencia", () => {
    render(<NewTransactionPage />);

    const errorButton = screen.getByTestId("form-error-Transferencia");
    fireEvent.click(errorButton);

    expect(screen.getByTestId("transaction-feedback-Transferencia")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-feedback-Transferencia")).toHaveAttribute(
      "data-success",
      "false"
    );
    expect(screen.getByTestId("feedback-message")).toHaveTextContent(
      "Faca uma nova transferência clicando no botão abaixo ou entre em contato com o suporte."
    );
  });

  it("shows success feedback for Deposito", () => {
    render(<NewTransactionPage />);

    const depositoTab = screen.getByTestId("tab-deposito");
    fireEvent.click(depositoTab);

    const successButton = screen.getByTestId("form-success-Deposito");
    fireEvent.click(successButton);

    expect(screen.getByTestId("transaction-feedback-Deposito")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-feedback-Deposito")).toHaveAttribute(
      "data-success",
      "true"
    );
  });

  it("shows error feedback for Deposito", () => {
    render(<NewTransactionPage />);

    const depositoTab = screen.getByTestId("tab-deposito");
    fireEvent.click(depositoTab);

    const errorButton = screen.getByTestId("form-error-Deposito");
    fireEvent.click(errorButton);

    expect(screen.getByTestId("transaction-feedback-Deposito")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-feedback-Deposito")).toHaveAttribute(
      "data-success",
      "false"
    );
    expect(screen.getByTestId("feedback-message")).toHaveTextContent(
      "Faca um novo deposito clicando no botão abaixo ou entre em contato com o suporte."
    );
  });

  it("shows success feedback for Saque", () => {
    render(<NewTransactionPage />);

    const saqueTab = screen.getByTestId("tab-saque");
    fireEvent.click(saqueTab);

    const successButton = screen.getByTestId("form-success-Saque");
    fireEvent.click(successButton);

    expect(screen.getByTestId("transaction-feedback-Saque")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-feedback-Saque")).toHaveAttribute(
      "data-success",
      "true"
    );
  });

  it("shows error feedback for Saque", () => {
    render(<NewTransactionPage />);

    const saqueTab = screen.getByTestId("tab-saque");
    fireEvent.click(saqueTab);

    const errorButton = screen.getByTestId("form-error-Saque");
    fireEvent.click(errorButton);

    expect(screen.getByTestId("transaction-feedback-Saque")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-feedback-Saque")).toHaveAttribute(
      "data-success",
      "false"
    );
    expect(screen.getByTestId("feedback-message")).toHaveTextContent(
      "Faca um novo saque clicando no botão abaixo ou entre em contato com o suporte."
    );
  });

  it("resets transaction result when reset button is clicked", () => {
    render(<NewTransactionPage />);

    const successButton = screen.getByTestId("form-success-Transferencia");
    fireEvent.click(successButton);

    expect(screen.getByTestId("transaction-feedback-Transferencia")).toBeInTheDocument();

    const resetButton = screen.getByTestId("feedback-reset");
    fireEvent.click(resetButton);

    expect(screen.queryByTestId("transaction-feedback-Transferencia")).not.toBeInTheDocument();
    expect(screen.getByTestId("transaction-form-Transferencia")).toBeInTheDocument();
  });

  it("calls clearClient when reset button is clicked", () => {
    render(<NewTransactionPage />);

    const successButton = screen.getByTestId("form-success-Transferencia");
    fireEvent.click(successButton);

    mockDispatch.mockClear();

    const resetButton = screen.getByTestId("feedback-reset");
    fireEvent.click(resetButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "client/clearClient",
      })
    );
  });

  it("resets form when reset button is clicked", () => {
    render(<NewTransactionPage />);

    const successButton = screen.getByTestId("form-success-Transferencia");
    fireEvent.click(successButton);

    expect(screen.getByTestId("transaction-feedback-Transferencia")).toBeInTheDocument();

    const resetButton = screen.getByTestId("feedback-reset");
    fireEvent.click(resetButton);

    const newForm = screen.getByTestId("transaction-form-Transferencia");
    expect(newForm).toBeInTheDocument();
    expect(screen.queryByTestId("transaction-feedback-Transferencia")).not.toBeInTheDocument();
  });

  it("does not show feedback for different transaction type", () => {
    render(<NewTransactionPage />);

    const successButton = screen.getByTestId("form-success-Transferencia");
    fireEvent.click(successButton);

    expect(screen.getByTestId("transaction-feedback-Transferencia")).toBeInTheDocument();

    const depositoTab = screen.getByTestId("tab-deposito");
    fireEvent.click(depositoTab);

    expect(screen.queryByTestId("transaction-feedback-Transferencia")).not.toBeInTheDocument();
    expect(screen.queryByTestId("transaction-feedback-Deposito")).not.toBeInTheDocument();
  });

  it("shows form after switching tabs and back", () => {
    render(<NewTransactionPage />);

    const successButton = screen.getByTestId("form-success-Transferencia");
    fireEvent.click(successButton);

    expect(screen.getByTestId("transaction-feedback-Transferencia")).toBeInTheDocument();

    const depositoTab = screen.getByTestId("tab-deposito");
    fireEvent.click(depositoTab);

    const transferenciaTab = screen.getByTestId("tab-transferencia");
    fireEvent.click(transferenciaTab);

    expect(screen.getByTestId("transaction-form-Transferencia")).toBeInTheDocument();
    expect(screen.queryByTestId("transaction-feedback-Transferencia")).not.toBeInTheDocument();
  });

  it("clears transaction result when switching tabs", () => {
    render(<NewTransactionPage />);

    const successButton = screen.getByTestId("form-success-Transferencia");
    fireEvent.click(successButton);

    expect(screen.getByTestId("transaction-feedback-Transferencia")).toBeInTheDocument();

    const depositoTab = screen.getByTestId("tab-deposito");
    fireEvent.click(depositoTab);

    expect(screen.queryByTestId("transaction-feedback-Transferencia")).not.toBeInTheDocument();
    expect(screen.getByTestId("transaction-form-Deposito")).toBeInTheDocument();

    const depositoSuccessButton = screen.getByTestId("form-success-Deposito");
    fireEvent.click(depositoSuccessButton);

    expect(screen.getByTestId("transaction-feedback-Deposito")).toBeInTheDocument();

    const transferenciaTab = screen.getByTestId("tab-transferencia");
    fireEvent.click(transferenciaTab);

    expect(screen.queryByTestId("transaction-feedback-Deposito")).not.toBeInTheDocument();
    expect(screen.getByTestId("transaction-form-Transferencia")).toBeInTheDocument();
  });
});
