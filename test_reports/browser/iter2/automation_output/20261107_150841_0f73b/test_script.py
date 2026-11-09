from pathlib import Path
import sys


def find_project_root():
    for parent in Path(__file__).resolve().parents:
        if (parent / "frontend" / "package.json").is_file():
            return parent
    raise RuntimeError("Could not locate project root (frontend/package.json).")


ROOT = find_project_root()
sys.path.insert(0, str(ROOT / "test_reports" / "browser"))

from smoke_test import run_smoke


if __name__ == "__main__":
    run_smoke(
        error_screenshot=Path(__file__).with_name("error_20261107_150841.jpeg"),
        mobile=True,
    )