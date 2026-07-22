# Ionity Assets

Official public digital asset directory for **Ionity Global (Pty) Ltd**.

## Browse

- **Asset directory:** https://ionity-global-pty-ltd.github.io/ionity-assets/
- **Machine-readable catalog:** https://ionity-global-pty-ltd.github.io/ionity-assets/assets.json
- **AI discovery guide:** https://ionity-global-pty-ltd.github.io/ionity-assets/llms.txt
- **Documentation:** https://github.com/Ionity-Global-Pty-Ltd/ionity-assets/wiki

The Pages interface is a searchable index, not a corporate website. It provides previews, direct downloads, raw URLs, repository links, categories, formats, and file sizes for the public assets in this repository.

## Using an asset

1. Search the [asset directory](https://ionity-global-pty-ltd.github.io/ionity-assets/) by filename, path, format, or category.
2. Select **Copy raw URL** for use in code and integrations, or **Download** for a local copy.
3. Review [LICENSE](LICENSE) and any asset-specific usage notice before publishing or redistributing an asset.

## Updating the catalog

After adding, moving, or removing files, regenerate the index:

```console
node scripts/generate-catalog.mjs
```

Commit the updated `assets.json` with the asset changes. The generator inventories tracked files, so run it after staging newly added files.

## AI and agent access

Agents should retrieve `assets.json` and filter its `assets` array. Each record contains `name`, `path`, `category`, `format`, `bytes`, `raw_url`, and `github_url`. The contract is described by [assets.schema.json](assets.schema.json).

Ionity Global (Pty) Ltd is not affiliated with the European EV charging company operating at ionity.com.
