/* (c) Stepan Rutz 2024. All rights reserved. License under the WTFPL */

export class Util {

    /* shuffle an array in place */
    static shuffle<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }        
    }

    /* shuffle on a per row basis */
    static shuffleRows<T>(array: T[]) {
        const n = Math.floor(Math.sqrt(array.length))
        const matrix: T[][] = []
        for (let i = 0; i < n; i++) {
            matrix.push(array.slice(i * n, (i + 1) * n))
        }
        //Util.transpose(matrix)
        Util.shuffle(matrix)
        const result = matrix.flat()
        for (let i = 0; i < array.length; i++) {
            array[i] = result[i]
        }
    }

    static transpose<T>(matrix: T[][]) {
        const n = Math.floor(Math.sqrt(matrix.length))
        const t: T[][] = []
        for (let i = 0; i < n; i++) {
            t.push(new Array(n))
        }
        for (let y = 0; y < n; y++) {
            for (let x = 0; x < n; x++) {
                t[x][y] = matrix[y][x]
            }
        }
        t.forEach((row, i) => matrix[i] = row)
    }

    /* format milliseconds as hours:minutes:seconds */
    static formatMillisAsHoursMinutesSecondsWithPadding(millis: number) {
        const hours = Math.floor(millis / 3600000)
        const minutes = Math.floor((millis % 3600000) / 60000)
        const seconds = Math.floor((millis % 60000) / 1000)
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

}
