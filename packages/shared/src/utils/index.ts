export const groupBy = <T>(arr: T[], fn: (item: T) => string): Record<string, T[]> => {
    return arr.reduce<Record<string, T[]>>((acc, curr) => {
        const groupKey = fn(curr);
        const group = acc[groupKey] || [];
        group.push(curr);
        return { ...acc, [groupKey]: group };
    }, {})
}

export const snakeCaseToHuman = (snake: string): string => {
    return snake.replace(/_/g, ' ')
        .replace(/(?:^|\s)\w/g, (ss) => ss.toUpperCase());
}