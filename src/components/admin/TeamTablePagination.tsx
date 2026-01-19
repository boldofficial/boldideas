'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis
} from '@/components/ui/pagination';

type Props = {
    page: number;
    totalPages: number;
};

export default function TeamTablePagination({ page, totalPages }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const createPageUrl = (p: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', p.toString());
        return `?${params.toString()}`;
    };

    const goToPage = (p: number) => {
        router.push(createPageUrl(p));
    };

    const getVisiblePages = () => {
        const pages: (number | 'ellipsis')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push('ellipsis');
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pages.push(i);
            }
            if (page < totalPages - 2) pages.push('ellipsis');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
            </p>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={page > 1 ? createPageUrl(page - 1) : '#'}
                            onClick={(e) => { if (page > 1) { e.preventDefault(); goToPage(page - 1); } }}
                            className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>

                    {getVisiblePages().map((p, idx) => (
                        <PaginationItem key={idx}>
                            {p === 'ellipsis' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href={createPageUrl(p)}
                                    onClick={(e) => { e.preventDefault(); goToPage(p); }}
                                    isActive={p === page}
                                    className="cursor-pointer"
                                >
                                    {p}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href={page < totalPages ? createPageUrl(page + 1) : '#'}
                            onClick={(e) => { if (page < totalPages) { e.preventDefault(); goToPage(page + 1); } }}
                            className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
