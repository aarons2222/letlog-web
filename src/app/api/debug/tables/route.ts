import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const tables = ['properties', 'tenancies', 'issues', 'tenders', 'quotes', 'compliance_items', 'profiles'];
  const results: Record<string, any> = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        results[table] = { error: error.message };
      } else if (data && data.length > 0) {
        results[table] = { columns: Object.keys(data[0]), sample: data[0] };
      } else {
        // Try to get columns even with no data
        const { data: emptyData, error: emptyError } = await supabase
          .from(table)
          .select('*')
          .limit(0);
        results[table] = { columns: 'empty table', error: emptyError?.message };
      }
    } catch (e: any) {
      results[table] = { error: e.message };
    }
  }
  
  return NextResponse.json(results, { status: 200 });
}
