import argparse
import download.hoj as hoj
import download.kep as kep


def main():
    parser = argparse.ArgumentParser(description="Download from competitive programming sites.")
    parser.add_argument("site", choices=["hoj", "kep"], help="Choose the site to download from.")

    args = parser.parse_args()

    if args.site == "hoj":
        hoj.download()
    elif args.site == "kep":
        kep.download()


if __name__ == "__main__":
    main()
