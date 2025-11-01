export function assertSchema(schema, data) {
  const res = schema.safeParse(data);
  if (!res.success) {
    const issues = res.error.issues.map(i => `${(i.path || []).join('.') || '(root)'}: ${i.message}`).join('; ');
    throw new Error(`Schema validation failed: ${issues}`);
  }
  return res.data;
}