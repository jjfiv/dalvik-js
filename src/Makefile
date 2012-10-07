INPUT  := node-main.js
TARGET := cpp-node-main.js

.PHONY: nodejs

all: nodejs

$(TARGET): $(INPUT)
	@cpp $(INPUT) | grep -v "#.*" > $(TARGET)

nodejs: $(TARGET)
	@node $(TARGET) && rm $(TARGET)

clean:
	@rm $(TARGET)

