/* (c) Stepan Rutz 2024. All rights reserved. License under the WTFPL */

export class Util {


    static zeroPadNumber(num: number, size: number) {
        let s = num + ""
        while (s.length < size) {
            s = "0" + s
        }
        return s
    }

    static shuffle<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }        
    }

}
