type CreateOverflowGroupSnippetOptions = {
  gap: number;
  maxLines: number;
  packageName: string;
};

export function createOverflowGroupSnippet({
  gap,
  maxLines,
  packageName,
}: CreateOverflowGroupSnippetOptions) {
  return `import { OverflowGroup } from '${packageName}'

<OverflowGroup
  maxLines={${maxLines}}
  gap={${gap}}
  renderOverflow={(count) => <Tag>+{count}</Tag>}
>
  {items.map((item) => (
    <Tag key={item}>{item}</Tag>
  ))}
</OverflowGroup>`;
}
