.PHONY: all clean format

PACKAGE_FILES := \
	manifest.json \
	background.js \
	storage.js \
	main.js \
	main.css \
	options.html \
	options.js \
	options.css \
	icon_16x16.png \
	icon_48x48.png \
	icon_128x128.png

all: package.zip

package.zip: Makefile $(PACKAGE_FILES)
	zip -FS ./package.zip $(PACKAGE_FILES)

clean: 
	rm -f ./package.zip

format:
	npx --yes prettier@3.9.8 --write "*.css" "*.js" "*.html" manifest.json
