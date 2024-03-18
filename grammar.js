const PREC = {
	conditional: -1,
	or: 10,
	and: 11,
	compare: 12,
	plus: 13,
	times: 14,
	unary: 15,
	call: 16,
	attribute: 17
}


module.exports = grammar({
	name: 'pine',

	extras: $ => [
		$.comment,
		/[\s\f\uFEFF\u2060\u200B]|\r?\n/,
		$.line_continuation,
	],

	conflicts: $ => [
		[$.function_declaration_statement, $.primary_expression],
		[$.primary_expression, $.base_type],
		[$.tuple_declaration_statement, $.primary_expression],
		[$._argument_list_with_type_optional, $._argument_list_with_type_optional1],
		[$.switch_statement]
	],

	inline: $ => [
		$._structure,
		$._arm_body
	],

	externals: $ => [
		$._indent,
		$._dedent,
		$._newline,
	],

	supertypes: $ => [
		$.statement,
		$.expression,
		$.literals,
		$.primary_expression,
		$.type,
	],

	rules: {
		source_file: $ => repeat($.statement),
		statement: $ => choice(
			$.expression_statement,
			$.import_statement,
			$.type_definition_statement,
			$.variable_definition_statement,
			$.tuple_declaration_statement,
			$.function_declaration_statement,
			$.if_statement,
			$.switch_statement,
			$.for_statement,
			$.for_in_statement,
			$.while_statement,
			$.reassignment_statement,
			$.argumented_assignment,
			$.break_statement,
			$.continue_statement,
		),
		if_statement: $ => seq(
			'if',
			field('condition', $.expression),
			field('consequence', $._suite),
			repeat(field('alternative', $.else_if_clause)),
			optional(field('alternative', $.else_clause))
		),
		else_if_clause: $ => seq(
			'else', 'if',
			field('condition', $.expression),
			field('consequence', $._suite)
		),
		else_clause: $ => seq(
			'else',
			field('consequence', $._suite)
		),
		switch_statement: $ => seq(
			'switch',
			optional(field('subject', $.expression)),
			repeat(field('body', seq(
				$._indent,
				repeat(field('arm', $.case_clause)),
				optional(field('default_arm', $._arm_body)),
				$._dedent
			)))
		),
		case_clause: $ => seq(
			field('pattern', $.expression),
			$._arm_body
		),
		for_statement: $ => seq(
			'for',
			field('counter', $.identifier),
			'=',
			field('from_num', $.expression),
			'to',
			field('to_num', $.expression),
			optional(seq(
				'by',
				field('step_num', $.expression)
			)),
			field('body', $._suite),

		),
		for_in_statement: $ => seq(
			'for',
			choice(
				field('array_element', $.identifier),
				seq(
					'[',
					field('index', $.identifier),
					',',
					field('array_element', $.identifier),
					']'
				)
			),
			'in',
			field('array_id', $.expression),
			field('body', $._suite)
		),
		while_statement: $ => seq(
			'while',
			field('condition', $.expression),
			field('body', $._suite)
		),
		break_statement: $ => seq('break', $._newline),
		continue_statement: $ => seq('continue', $._newline),
		_structure: $ => choice(
			$.if_statement,
			$.for_statement,
			$.for_in_statement,
			$.while_statement,
			$.switch_statement
		),
		type_definition_statement: $ => seq(
			optional('export'),
			'type',
			field('name', $.identifier),
			$._indent,
			repeat1(seq(
				field('field_type', $.type),
				field('field_name', $.identifier),
				optional(
					seq(
						'=',
						field('field_default', $.expression)
					)
				),
				$._newline
			)),
			$._dedent
		),
		variable_definition_statement: $ => seq(
			optional(field('declaration_mode', $.declaration_mode)),
			optional(field('qualifier', $.type_qualifier)),
			optional(field('type', $.type)),
			field('variable', $.identifier),
			'=',
			choice(
				seq(
					field('initial_value', $.expression_statement),
				),
				seq(
					field('initial_structure', $._structure)
				)
			)
		),
		tuple_declaration_statement: $ => seq(
			'[',
			field('variables', sep1($.identifier, ',')),
			']',
			'=',
			field('initial_value', choice(seq($.call, $._newline), $._structure))
		),
		reassignment_statement: $ => seq(
			field('variable', choice($.identifier, $.attribute)),
			':=',
			field('value', $.expression_statement)
		),
		argumented_assignment: $ => seq(
			field('left', $.identifier),
			field('operator', choice(
				'+=', '-=', '*=', '/=', '%='
			)),
			field('right', $.expression)
		),
		declaration_mode: _ => choice(
			'varip',
			'var'
		),
		function_declaration_statement: $ => choice(
			seq(
				'export',
				field('function', $.identifier),
				$._argument_list_with_type,
				$._arm_body
			),
			seq(
				'export',
				'method',
				field('method', $.identifier),
				$._argument_list_with_type1,
				$._arm_body
			),
			seq(
				field('function', $.identifier),
				$._argument_list_with_type_optional,
				$._arm_body
			),
			seq(
				field('method', $.identifier),
				$._argument_list_with_type_optional1,
				$._arm_body
			)
		),
		_arm_body: $ => field('body', seq('=>', choice(
			$.statement,
			$._suite
		))),
		_argument_list_with_type: $ => seq(
			'(',
			optional(sep1(seq(
				optional(field('qualifier', $.type_qualifier)),
				field('type', $.type),
				field('argument', $.identifier),
				optional(seq(
					'=',
					field('default_value', $.expression)
				))
			), ',')),
			')'
		),
		_argument_list_with_type1: $ => seq(
			'(',
			sep1(seq(
				optional(field('qualifier', $.type_qualifier)),
				field('type', $.type),
				field('argument', $.identifier),
				optional(seq(
					'=',
					field('default_value', $.expression)
				))
			), ','),
			')'
		),
		_argument_list_with_type_optional: $ => seq(
			'(',
			optional(sep1(seq(
				optional(field('qualifier', $.type_qualifier)),
				optional(field('type', $.type)),
				field('argument', $.identifier),
				optional(seq(
					'=',
					field('default_value', $.expression)
				))
			), ',')),
			')'
		),
		_argument_list_with_type_optional1: $ => seq(
			'(',
			seq(
				optional(field('qualifier', $.type_qualifier)),
				field('type', $.type),
				field('argument', $.identifier),
				optional(seq(
					'=',
					field('default_value', $.expression)
				))
			),
			optional(sep1(seq(
				optional(field('qualifier', $.type_qualifier)),
				optional(field('type', $.type)),
				field('argument', $.identifier),
				optional(seq(
					'=',
					field('default_value', $.expression)
				))
			), ',')),
			')'
		),
		import_statement: $ => seq(
			'import',
			field('path', $.import_path),
			optional(seq(
				'as',
				field('alias', $.identifier)
			)),
			$._newline
		),
		import_path: _ => seq(
			field('username', /[^\/\s]+/),
			'/',
			field('export', /[^\/\s]+/),
			'/',
			field('version', /[^\/\s]+/)
		),
		expression_statement: $ => seq(
			$.expression,
			$._newline
		),
		expression: $ => choice(
			$.conditional_expression,
			$.comparison_operation,
			$.logical_operation,
			$.math_operation,
			$.unary_operation,
			$.template_argument_list,
			$.literals,
			$.primary_expression,
		),
		primary_expression: $ => choice(
			$.subscript,
			$.attribute,
			$.call,
			$.identifier,
			$.parenthesized_expression,
		),
		literals: $ => choice(
			$.true,
			$.false,
			$.na,
			$.color,
			$.integer,
			$.float,
			$.string,
			$.tuple,
		),
		template_function: $ => seq(
			field('name', $.identifier),
			field('arguments', $.template_argument_list)
		),
		attribute: $ => prec.right(seq(
			prec(PREC.attribute, seq(
				field('object', $.primary_expression),
				'.',
			)),
			field('attribute', choice(
				$.identifier,
				$.template_function,
			))
		)),
		keyword_argument: $ => seq(
			field('key', $.identifier),
			'=',
			field('value', $.expression)
		),
		argument_list: $ => seq(
			'(',
			optional(sep1(choice(
				$.expression,
				$.keyword_argument
			), ',')),
			')'
		),
		call: $ => prec(PREC.call, seq(
			field('function', $.expression),
			field('arguments', $.argument_list)
		)),
		subscript: $ => prec(PREC.call, seq(
			field('series', $.primary_expression),
			'[',
			field('offset', $.expression),
			']'
		)),
		conditional_expression: $ => prec.right(PREC.conditional, seq(
			field('condition', $.expression),
			'?',
			field('if_branch', $.expression),
			':',
			field('else_branch', $.expression)
		)),
		tuple: $ => seq(
			'[',
			sep1($.expression, ','),
			']'
		),
		parenthesized_expression: $ => seq(
			'(',
			$.expression,
			')'
		),
		logical_operation: $ => choice(
			prec.left(PREC.and, seq(
				field('left', $.expression),
				field('operator', 'and'),
				field('right', $.expression)
			)),
			prec.left(PREC.or, seq(
				field('left', $.expression),
				field('operator', 'or'),
				field('right', $.expression)
			))
		),
		math_operation: $ => {
			const table = [
				[prec.left, '+', PREC.plus],
				[prec.left, '-', PREC.plus],
				[prec.left, '*', PREC.times],
				[prec.left, '/', PREC.times],
				[prec.left, '%', PREC.times]
			]
			return choice(...table.map(([fn, operator, precdence]) => fn(precdence, seq(
				field('left', $.expression),
				field('operator', operator),
				field('right', $.expression)
			))))
		},
		unary_operation: $ => prec(PREC.unary, seq(
			field('operator', choice('+', '-', 'not')),
			field('argument', $.expression)
		)),
		comparison_operation: $ => prec.left(PREC.compare, seq(
			field('left', $.expression),
			field('operator', choice('<', '<=', '==', '!=', '>', '>=')),
			field('right', $.expression)
		)),
		type: $ => choice(
			$.array_type,
			$.generic_type,
			$.base_type,
		),
		base_type: $ => sep1($.identifier, '.'),
		array_type: $ => seq(
			field('base_type', $._array_base_type),
			field('suffix', seq('[', ']'))
		),
		_array_base_type: $ => choice(
			$.base_type,
			$.array_type
		),
		generic_type: $ => seq(
			field('base_type', $.base_type),
			field('arguments', $.template_argument_list)
		),
		template_argument_list: $ => seq(
			'<',
			sep1($.type, ','),
			alias(token(prec(1, '>')), '>')
		),
		type_qualifier: _ => choice(
			'series',
			'const',
			'simple'
		),
		identifier: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/,
		integer: _ => token(repeat1(/[0-9]+/)),
		float: _ => {
			const digits = repeat1(/[0-9]+_?/)
			const exponent = seq(/[eE][\+-]?/, digits)

			return token(seq(
				choice(
					seq(digits, '.', optional(digits), optional(exponent)),
					seq(optional(digits), '.', digits, optional(exponent)),
					seq(digits, exponent),
				),
				optional(choice(/[Ll]/, /[jJ]/)),
			))
		},
		color: _ => token(/#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{8}/),
		true: _ => 'true',
		false: _ => 'false',
		na: _ => 'na',
		string: $ => choice(
			$.single_quotted_string,
			$.double_quotted_string,
		),
		single_quotted_string: $ => seq(
			'\'',
			repeat(choice(
				alias(token.immediate(prec(1, /[^\\'\n]+/)), $.string_content),
				$.escape_sequence
			)),
			'\'',
		),
		double_quotted_string: $ => seq(
			'"',
			repeat(choice(
				alias(token.immediate(prec(1, /[^\\"\n]+/)), $.string_content),
				$.escape_sequence
			)),
			'"',
		),
		escape_sequence: _ => token(prec(1, seq(
			'\\',
			choice(
				/[^xuU]/,
				/\d{2,3}/,
				/x[0-9a-fA-F]{2,}/,
				/u[0-9a-fA-F]{4}/,
				/U[0-9a-fA-F]{8}/,
			)
		))),
		_suite: $ => choice(
			seq($._indent, $.block),
			alias($._newline, $.block)
		),
		block: $ => seq(
			repeat($.statement),
			$._dedent
		),
		comment: $ => seq(
			'//',
			repeat(choice(
				alias(token.immediate(/[^\n]+/), $.comment_content),
				$.annotations
			)),
			$._newline
		),
		annotations: _ => token(prec(1, seq(
			'@', 
			choice(
				'description',
				'field',
				'function',
				'param',
				'returns',
				'streategy_alert_message',
				'type',
				'variable',
				'version='
			)
		))),
		line_continuation: _ => token(seq('\\', choice(seq(optional('\r'), '\n'), '\0')))
	}
})

module.exports.PREC = PREC

function sep1(rule, separator) {
	return seq(
		rule,
		repeat(seq(
			separator,
			rule
		))
	)
}
