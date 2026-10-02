.PHONY: all clean format

all: package.zip

package.zip: *.json *.html *.js *.css *.png
	zip -r ./package.zip . -x \
	*.git/* \
	.gitignore \
	docs/ \
	docs/* \
	README.md \
	Makefile 

clean: 
	rm ./package.zip

format:
	npx --yes prettier@3.9.8 --write "*.css" "*.js" "*.html" manifest.json
