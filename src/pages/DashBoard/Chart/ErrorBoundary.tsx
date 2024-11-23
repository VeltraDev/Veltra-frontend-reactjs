import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
                    <h2 className="font-semibold">Something went wrong</h2>
                    <p>Please try refreshing the page</p>
                </div>
            );
        }

        return this.props.children;
    }
}