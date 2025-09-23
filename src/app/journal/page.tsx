import { Separator } from '@/components/ui/separator';
import { journalEntries } from '@/lib/placeholder-videos';

export default function JournalPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-12">
        {journalEntries.map((entry, index) => (
          <article key={entry.title}>
            <h2 className="text-2xl font-bold tracking-tight">{entry.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{entry.date}</p>
            <div 
              className="mt-6 space-y-4 text-foreground/80 leading-relaxed [&_a]:underline [&_a:hover]:text-accent"
              dangerouslySetInnerHTML={{ __html: entry.content }} 
            />
            {index < journalEntries.length - 1 && <Separator className="my-12 bg-border/40" />}
          </article>
        ))}
      </div>
    </div>
  );
}
