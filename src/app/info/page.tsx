import { ArrowRight } from 'lucide-react';
import { info } from '@/lib/placeholder-videos';

export default function InfoPage() {
  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-foreground/90 leading-relaxed">{info.bio}</p>
        </div>
        <div>
          <ul className="space-y-2">
            {info.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group text-lg py-2 border-b border-border/40 hover:border-foreground/50 transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
