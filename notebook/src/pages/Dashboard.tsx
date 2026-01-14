import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { NoteCard } from "@/components/NoteCard";
import { Plus, LogOut, BookOpen, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createNote = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("notes").insert({
        title: newTitle.trim() || "Untitled",
        content: newContent,
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setNewTitle("");
      setNewContent("");
      setIsCreating(false);
      toast({ title: "Note created", description: "Your note has been saved." });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-heading text-xl font-semibold">My Notes</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Create Note Section */}
        {isCreating ? (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="mb-4 font-heading text-lg font-medium">New Note</h2>
            <div className="space-y-4">
              <Input
                placeholder="Note title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border-0 bg-transparent px-0 text-lg font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0"
              />
              <Textarea
                placeholder="Start writing..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={6}
                className="resize-none border-0 bg-transparent px-0 placeholder:text-muted-foreground/50 focus-visible:ring-0"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => createNote.mutate()}
                  disabled={createNote.isPending}
                  size="sm"
                >
                  {createNote.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save note
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setNewTitle("");
                    setNewContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="mb-8 flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/50 p-6 text-left transition-colors hover:border-primary/30 hover:bg-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <span className="text-muted-foreground">Create a new note...</span>
          </button>
        )}

        {/* Notes List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notes && notes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-medium">No notes yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first note to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
