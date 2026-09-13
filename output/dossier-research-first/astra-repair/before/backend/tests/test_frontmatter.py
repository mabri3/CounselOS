from datetime import date

import pytest
import yaml

import frontmatter


def test_fast_safe_loader_preserves_metadata_and_body():
    metadata = """title: Saved work
created: 2026-09-04
active: true
claims:
  - id: CLM-1
    text: 'Café: saved analysis'
    sources: [SRC-1, SRC-2]
empty: null
"""
    post = frontmatter.loads(f"---\n{metadata}---\n\n# Existing answer\n")
    assert post.metadata == yaml.safe_load(metadata)
    assert post.metadata["created"] == date(2026, 9, 4)
    assert post.content == "# Existing answer\n"
    assert frontmatter.loads(frontmatter.dumps(post)).metadata == post.metadata


def test_frontmatter_still_rejects_python_objects_and_non_mapping_metadata():
    with pytest.raises(yaml.constructor.ConstructorError):
        frontmatter.loads('---\nvalue: !!python/object:builtins.object {}\n---\nBody')
    with pytest.raises(ValueError, match="YAML mapping"):
        frontmatter.loads('---\n- item\n---\nBody')
