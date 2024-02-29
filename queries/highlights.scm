(identifier) @variable

((identifier) @constant
  (#match? @constant "^[A-Z][A-Z_0-9]*$"))

(call
  function: (attribute (identifier) @function.method))

(call
  function: (identifier) @function)

((call
  function: (identifier) @function.builtin)
 (#match?
  @function.builtin
  "^(library|indicator|strategy|bool|int|float|string|plot|na)$"))

(attribute attribute: (identifier) @property)

(function_declaration_statement
  function: (identifier) @function
  argument: (identifier) @variable.parameter)

(keyword_argument
  key: (identifier) @variable.parameter)

(arguments_list
  ["(" ")"] @operator)

(type_definition_statement
  type_name: (identifier) @type)

(import_statement
  path: (import_path) @label)

(import_statement
  alias: (identifier) @define)

[
 "="
 ":="
 "=="
 "!="
 ">="
 "<="
 ">"
 "<"
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
 "?"
 ":"
 "and"
 "or"
 "not"
 "["
 "]"
 "=>"
 ] @operator

[
 ","
 ] @punctuation

[
 "type"
 "import"
 "as"
 "export"
 "method"
 "for"
 "in"
 "to"
 "by"
 "if"
 "else"
 "switch"
 "while"
 "break"
 "continue"
 ] @keyword

[
 "simple"
 "const"
 "series"
 ] @keyword

[
 "var"
 "varip"
 ] @keyword

[
 (na)
 ] @constant.builtin

[
 (true)
 (false)
 ] @boolean

[
 (integer)
 (color)
 ] @number

(float) @float

(string) @string
(escape_sequence) @string.escape

(comment) @comment

(type) @type
