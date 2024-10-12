
# VueSolitaire

# Preview

![preview](https://raw.githubusercontent.com/srutz/vuesolitaire/main/public/solitaire.gif)


# Live Game-Link

https://srutz.github.io/vuesolitaire/

# Tech used:

Vue.js + TypeScript + Vite + Tailwind + React Router

# Author

stepan.rutz AT gmx.de

# Images

Images are from https://pexels.com

- https://www.pexels.com/photo/white-and-yellow-playing-cards-39018/
- https://www.pexels.com/photo/playing-card-deck-58562/
- https://www.pexels.com/photo/playing-cards-deck-279009/


# License

Its the WTFPL license. Do what you want with it, but check the LICENSE file for details.

# The SVG Files

The svg File were manipulated like this

```bash
for i in *.svg; do inkscape $i --actions="select-all; page-fit-to-selection;  export-do; file-close"; done
ls -1 *_out.svg | while read i; do n=${i/_out/}; mv $i $n; done
```

Beforehand the files were downloaded like this:

```bash
cat cards.json > jq '.cards[].image' |sort | sed -e 's/.png$/.svg/' | while read a; do echo wget $a; sleep 1; done 
```

Cards.json was obtained from https://deckofcardsapi.com.

 
