import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
}

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const deleteNote = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("notes").delete().eq("id", note.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({ title: "Note deleted", description: "Your note has been removed." });
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const contentPreview = note.content
    ? note.content.length > 120
      ? note.content.substring(0, 120) + "..."
      : note.content
    : "No content";

  return (
    <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-medium">
      <Link to={`/note/${note.id}`} className="block">
        <h3 className="font-heading text-lg font-medium text-foreground line-clamp-1">
          {note.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {contentPreview}
        </p>
        <p className="mt-4 text-xs text-muted-foreground/70">
          {format(new Date(note.created_at), "MMM d, yyyy")}
        </p>
      </Link>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteNote.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteNote.isPending}
            >
              {deleteNote.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
