NPM_BIN=$(shell npm bin)
PROTOC_BIN=protoc
OUT_DIR="./src/_gen"
PROTO_PATH="./proto"

.PHONY: gen
gen:
	rm -rf $(OUT_DIR) && mkdir -p $(OUT_DIR)
	$(PROTOC_BIN) --plugin=$(NPM_BIN)/protoc-gen-ts_proto \
		--ts_proto_out=$(OUT_DIR) \
		--ts_proto_opt=returnObservable=false \
		-I ./ \
		$(PROTO_PATH)/*.proto
