all: package.zip

package.zip: *.json *.html *.js *.svg *.png
	zip -r ./package.zip . -x \
	*.git/* \
	.gitignore \
	docs/ \
	docs/* \
	README.md \
	Makefile 

clean: 
	rm ./package.zip
