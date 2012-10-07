INPUT  := node-main.js
TARGET := cpp-node-main.js

all: nodejs

$(TARGET): $(INPUT)
	@cpp $(INPUT) | grep -v "#.*" > $(TARGET)

.PHONY: nodejs

nodejs: $(TARGET)
	@node $(TARGET)

clean:
	@rm $(TARGET)

