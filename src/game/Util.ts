/* (c) Stepan Rutz 2024. All rights reserved. License under the WTFPL */

export class Util {

    static shuffle<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }        
    }

    static formatMillisAsHoursMinutesSecondsWithPadding(millis: number) {
        const hours = Math.floor(millis / 3600000)
        const minutes = Math.floor((millis % 3600000) / 60000)
        const seconds = Math.floor((millis % 60000) / 1000)
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

}
