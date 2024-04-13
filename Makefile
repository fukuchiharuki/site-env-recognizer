all: package.zip

package.zip: *.json *.html *.js *.svg *.png
	zip -r ./package.zip . -x docs/ docs/* *.git/* .gitignore Makefile

clean: 
	rm ./package.zip
