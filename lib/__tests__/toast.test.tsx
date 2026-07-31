import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { ToastProvider, useToast } from '../toast';

function ToastTrigger() {
    const { success, error, info } = useToast();
    return (
        <div>
            <button onClick={() => success('Saved successfully')}>btn-success</button>
            <button onClick={() => error('Something failed')}>btn-error</button>
            <button onClick={() => info('Heads up')}>btn-info</button>
        </div>
    );
}

function renderWithProvider() {
    render(
        <ToastProvider>
            <ToastTrigger />
        </ToastProvider>
    );
}

describe('ToastProvider', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it('shows a success toast when triggered', () => {
        renderWithProvider();

        fireEvent.click(screen.getByText('btn-success'));
        expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    });

    it('shows error and info toasts with distinct content', () => {
        renderWithProvider();

        fireEvent.click(screen.getByText('btn-error'));
        fireEvent.click(screen.getByText('btn-info'));
        expect(screen.getByText('Something failed')).toBeInTheDocument();
        expect(screen.getByText('Heads up')).toBeInTheDocument();
    });

    it('auto-dismisses toasts after the duration', () => {
        renderWithProvider();

        fireEvent.click(screen.getByText('btn-success'));
        expect(screen.getByText('Saved successfully')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument();
    });

    it('dismisses a toast on close button click', () => {
        renderWithProvider();

        fireEvent.click(screen.getByText('btn-success'));
        expect(screen.getByText('Saved successfully')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
        expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument();
    });

    it('limits toasts to the maximum count', () => {
        renderWithProvider();

        fireEvent.click(screen.getByText('btn-success'));
        fireEvent.click(screen.getByText('btn-error'));
        fireEvent.click(screen.getByText('btn-info'));
        fireEvent.click(screen.getByText('btn-success'));

        expect(screen.getAllByRole('status')).toHaveLength(3);
    });

    it('throws when useToast is used outside the provider', () => {
        function Outside() {
            useToast();
            return null;
        }
        expect(() => render(<Outside />)).toThrow('useToast must be used within a ToastProvider');
    });
});
