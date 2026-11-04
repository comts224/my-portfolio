"""Check internal links in generated GitHub Pages HTML."""
import argparse
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        attribute = "href" if tag in ("a", "link") else "src"
        if tag in ("a", "link", "img", "script", "source", "video", "audio"):
            value = attrs.get(attribute)
            if value:
                self.links.append(value)


def check_links(public, base_path):
    public = public.resolve()
    prefix = "/" + base_path.strip("/") + "/"
    errors = []
    checked = 0

    for html in sorted(public.rglob("*.html")):
        parser = LinkParser()
        parser.feed(html.read_text(encoding="utf-8"))

        relative = html.relative_to(public)
        if relative.name == "index.html":
            page_url = prefix + (
                relative.parent.as_posix().rstrip(".") + "/"
                if relative.parent != Path(".") else ""
            )
        else:
            page_url = prefix + relative.as_posix()

        for link in parser.links:
            link = link.strip()
            if not link or link.startswith(("#", "?")):
                continue

            parsed = urlsplit(link)
            if parsed.scheme or parsed.netloc or link.startswith("//"):
                continue

            target_url = urljoin(page_url, link)
            target_path = unquote(urlsplit(target_url).path)

            if not target_path.startswith(prefix):
                errors.append((str(relative), link, "프로젝트 경로 밖"))
                continue

            local = target_path[len(prefix):]
            target = (public / local).resolve()

            if not target.is_relative_to(public):
                errors.append((str(relative), link, "허용되지 않은 경로"))
                continue

            checked += 1

            if target.is_file():
                continue
            if target.is_dir() and (target / "index.html").is_file():
                continue

            errors.append((str(relative), link, "파일 또는 페이지 없음"))

    return checked, errors


def self_test():
    with tempfile.TemporaryDirectory() as temp:
        public = Path(temp)
        (public / "about").mkdir()
        (public / "about/index.html").write_text("About", encoding="utf-8")
        (public / "image.png").write_bytes(b"test")

        (public / "index.html").write_text(
            '<a href="/my-portfolio/about/">소개</a>'
            '<img src="/my-portfolio/image.png">'
            '<a href="https://example.com">외부</a>',
            encoding="utf-8",
        )
        count, errors = check_links(public, "/my-portfolio/")
        assert count == 2 and not errors, (count, errors)

        (public / "index.html").write_text(
            '<a href="/my-portfolio/missing/">없는 페이지</a>',
            encoding="utf-8",
        )
        count, errors = check_links(public, "/my-portfolio/")
        assert count == 1 and len(errors) == 1, (count, errors)

    print("자체 테스트 2개 통과")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", nargs="?", default="public")
    parser.add_argument("--base-path", default="/my-portfolio/")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        self_test()
    else:
        public = Path(args.directory)
        if not public.is_dir():
            parser.error(f"빌드 폴더가 없습니다: {public}")

        checked, errors = check_links(public, args.base_path)
        print(f"내부 링크 {checked}개 검사, 오류 {len(errors)}개")

        for page, link, reason in errors[:30]:
            print(f"오류: {page} → {link} ({reason})")

        if len(errors) > 30:
            print(f"그 외 {len(errors) - 30}개 오류")

        if errors:
            raise SystemExit(1)

        print("내부 링크 검사 통과")
