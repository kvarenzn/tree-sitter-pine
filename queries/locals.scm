; Definitions
(function_declaration_statement
  function: (identifier) @local.definition.function)

(function_declaration_statement
  method: (identifier) @local.definition.method)

(variable_definition
  variable: (identifier) @local.definition.var)

(variable_definition_statement
  variable: (identifier) @local.definition.var)

(tuple_declaration
  variables: (identifier) @local.definition.var)

(tuple_declaration_statement
  variables: (identifier) @local.definition.var)

(function_declaration_statement
  argument: (identifier) @local.definition.var)

(for_statement
  counter: (identifier) @local.definition.var)

(for_in_statement
  array_element: (identifier) @local.definition.var)

(for_in_statement
  index: (identifier) @local.definition.var)

(type_definition_statement
  name: (identifier) @local.definition.type)

; References
(identifier) @local.reference

((call
  function: (identifier) @local.reference)
 (#set! reference.kind "call"))

((call
   function: (attribute
			   attribute: (identifier) @local.reference))
 (#set! reference.kind "call"))

((call
   function: (template_function
			   name: (attribute
					   attribute: (identifier) @local.reference)))
 (#set! reference.kind "call"))

; Scopes
(block) @local.scope

(if_statement) @local.scope

(switch_statement) @local.scope

(for_statement) @local.scope

(for_in_statement) @local.scope

(while_statement) @local.scope

(function_declaration_statement) @local.scope

(source_file) @local.scope
