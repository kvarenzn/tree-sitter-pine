(identifier) @variable

((identifier) @constant
  (#match? @constant "^[A-Z][A-Z_0-9]*$"))

((identifier) @constant.builtin
  (#any-of? @constant.builtin
   "adjustment"
   "alert"
   "array"
   "barmerge"
   "box"
   "chart"
   "color"
   "currency"
   "dayofweek"
   "display"
   "dividends"
   "earnings"
   "extend"
   "font"
   "format"
   "hline"
   "input"
   "label"
   "line"
   "linefill"
   "location"
   "log"
   "map"
   "math"
   "matrix"
   "na"
   "order"
   "plot"
   "polyline"
   "position"
   "request"
   "runtime"
   "scale"
   "session"
   "shape"
   "size"
   "splits"
   "str"
   "strategy"
   "syminfo"
   "ta"
   "table"
   "text"
   "ticker"
   "timeframe"
   "xloc"
   "yloc"
   ))

((identifier) @variable.builtin
  (#any-of? @variable.builtin
   "bar_index"
   "barstate"
   "close"
   "dayofmonth"
   "earnings"
   "high"
   "hl2"
   "hlc3"
   "hlcc4"
   "hour"
   "last_bar_index"
   "last_bar_time"
   "low"
   "minute"
   "month"
   "ohlc4"
   "open"
   "second"
   "time"
   "time_close"
   "time_tradingday"
   "timenow"
   "volume"
   "weekofyear"
   "year"
   ))

(attribute attribute: (identifier) @property)

(template_function
  name: (attribute attribute: (identifier) @function))

(call
  function: (attribute attribute: (identifier) @function.method))

(call
  function: (identifier) @function)

(call
  function: (attribute attribute: (identifier) @function))

((call
   function: (attribute attribute: (identifier) @constructor))
 (#eq? @constructor "new"))

((call
  function: (identifier) @function.builtin)
 (#any-of? @function.builtin
  "alert"
  "alertcondition"
  "barcolor"
  "bgcolor"
  "bool"
  "box"
  "color"
  "dayofmonth"
  "dayofweek"
  "fill"
  "fixnan"
  "float"
  "hline"
  "hour"
  "indicator"
  "input"
  "int"
  "label"
  "library"
  "line"
  "linefill"
  "max_bars_back"
  "minute"
  "month"
  "na"
  "nz"
  "plot"
  "plotarrow"
  "plotbar"
  "plotcandle"
  "plotchar"
  "plotshape"
  "second"
  "strategy"
  "string"
  "time"
  "time_close"
  "timestamp"
  "weekofyear"
  "year"
  ))

((call
   function: (template_function name: (attribute attribute: (identifier) @constructor)))
 (#eq? @constructor "new"))

(function_declaration_statement
  function: (identifier) @function)

(function_declaration_statement
  argument: (identifier) @variable.parameter)

(function_declaration_statement
  method: (identifier) @method)

(function_declaration_statement
  ["(" ")"] @punctuation.bracket)

(keyword_argument
  key: (identifier) @variable.parameter)

(argument_list
  ["(" ")"] @operator)

(template_argument_list
  ["<" ">"] @punctuation.bracket)

(type_definition_statement
  ["type"] @keyword.type)

(type_definition_statement
  name: (identifier) @type.definition)

(import
  path: (import_path) @label)

(import
  alias: (identifier) @define)

(comparison_operation
  ["<" ">"] @operator)

(conditional_expression
  ["?" ":"] @keyword.conditional.ternary)

(parenthesized_expression
  ["(" ")"] @punctuation.bracket)

[
 "="
 ":="
 "=="
 "!="
 ">="
 "<="
 "+"
 "+="
 "-"
 "-="
 "*"
 "*="
 "/"
 "/="
 "%"
 "%="
 "=>"
 ] @operator

(function_declaration_statement
  ["=>"] @keyword.function)

[
 "and"
 "or"
 "not"
 ] @keyword.operator

[
 ","
 "."
 ] @punctuation.delimiter

[
 "["
 "]"
 ] @punctuation.bracket

[
 "export"
 (break)
 (continue)
 ] @keyword

[
 "method"
 ] @keyword.modifier

[
 "import"
 "as"
 ] @keyword.import

[
 "if" "else" "switch"
 ] @keyword.conditional

["for"
 "while"
 "in"
 "to"
 "by"
 ] @keyword.repeat

[
 "simple"
 "const"
 "series"
 ] @keyword.modifier

[
 "var"
 "varip"
 ] @keyword.modifier

[
 (true)
 (false)
 ] @boolean

(integer) @number
(float) @number.float
(color) @string.special

(string) @string
(escape_sequence) @string.escape

(comment) @comment
(annotations) @markup.strong

(base_type
  (identifier) @type)

((base_type
  (identifier) @type.builtin)
 (#any-of? @type.builtin
  "array"
  "bool"
  "box"
  "chart"
  "color"
  "float"
  "int"
  "label"
  "line"
  "linefill"
  "map"
  "matrix"
  "polyline"
  "series"
  "simple"
  "string"
  "table"
  ))
