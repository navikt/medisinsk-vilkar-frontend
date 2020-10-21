export function required(v: any) {
    if (v === null || v === undefined) {
        return 'Du må oppgi en verdi';
    }
}
