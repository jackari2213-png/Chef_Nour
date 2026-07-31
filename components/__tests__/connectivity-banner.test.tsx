import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ConnectivityBanner from '../ConnectivityBanner';

vi.mock('@/lib/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) =>
            key === 'connectivity.offlineTitle'
                ? "You're offline"
                : 'Saved content stays available, updates resume automatically',
        isRTL: false,
    }),
}));

describe('ConnectivityBanner', () => {
    beforeEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders nothing while online', () => {
        render(<ConnectivityBanner />);
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('appears when the browser goes offline', () => {
        render(<ConnectivityBanner />);
        fireEvent(window, new Event('offline'));
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText("You're offline")).toBeInTheDocument();
    });

    it('disappears when connectivity returns', () => {
        render(<ConnectivityBanner />);
        fireEvent(window, new Event('offline'));
        expect(screen.getByRole('status')).toBeInTheDocument();
        fireEvent(window, new Event('online'));
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});
