"""Check basic accessibility attributes in generated HTML."""
import argparse
from html.parser import HTMLParser
from pathlib import Path


class AccessibilityParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.issues = []
        self.labels = set()
        self.inputs = []
        self.buttons = []
        self.current_button = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        line = self.getpos()[0]

        if tag == "img" and "alt" not in attrs:
            self.issues.append((line, "이미지 alt 속성 누락"))

        if tag == "label" and attrs.get("for"):
            self.labels.add(attrs["for"])

        if tag in ("input", "select", "textarea"):
            if tag == "input" and attrs.get("type", "").lower() == "hidden":
                return
            if not attrs.get("aria-label") and not attrs.get("aria-labelledby"):
                self.inputs.append((line, attrs.get("id"), attrs.get("type", "")))

        if tag == "button":
            self.current_button = {
                "line": line,
                "label": attrs.get("aria-label") or attrs.get("aria-labelledby"),
                "text": ""
            }
            self.buttons.append(self.current_button)

    def handle_endtag(self, tag):
        if tag == "button":
            self.current_button = None

    def handle_data(self, data):
        if self.current_button is not None:
            self.current_button["text"] += data

    def finish(self):
        for line, input_id, _ in self.inputs:
            if not input_id or input_id not in self.labels:
                self.issues.append((line, "입력 요소의 레이블 확인 필요"))

        for button in self.buttons:
            if not button["label"] and not button["text"].strip():
                self.issues.append((button["line"], "버튼 이름 확인 필요"))

        return self.issues


def check(directory):
    errors = []
    for html in sorted(directory.rglob("*.html")):
        parser = AccessibilityParser()
        parser.feed(html.read_text(encoding="utf-8"))
        for line, issue in parser.finish():
            errors.append((html.relative_to(directory), line, issue))
    return errors


if __name__ == "__main__":
    cli = argparse.ArgumentParser()
    cli.add_argument("directory", nargs="?", default="public")
    args = cli.parse_args()

    directory = Path(args.directory)
    if not directory.is_dir():
        cli.error(f"폴더를 찾을 수 없습니다: {directory}")

    errors = check(directory)
    print(f"접근성 검사: 오류 후보 {len(errors)}개")

    for file, line, issue in errors[:30]:
        print(f"{file}:{line}: {issue}")

    if errors:
        raise SystemExit(1)

    print("기본 접근성 검사 통과")
