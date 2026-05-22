import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ComingSoonPageProps = {
  title: string;
  description: string;
};

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Badge className="border-white/10 bg-white/6 text-slate-200">
          Placeholder route
        </Badge>
        <span className="text-sm text-slate-500">Sprint 1</span>
      </div>
      <Card className="border-white/10 bg-white/6 text-white">
        <CardHeader className="space-y-3 p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <CardTitle className="text-3xl text-white">{title}</CardTitle>
          <CardDescription className="max-w-2xl text-base text-slate-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 px-8 pb-8">
          <Button asChild>
            <Link href="/dashboard">
              Back to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
