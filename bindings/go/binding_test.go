package tree_sitter_pine_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-pine"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_pine.Language())
	if language == nil {
		t.Errorf("Error loading Pine grammar")
	}
}
