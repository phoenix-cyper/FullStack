import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Post } from "@/lib/posts";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Post | undefined;
  onSubmit: (values: Pick<Post, "title" | "excerpt" | "status">) => void;
};

export function PostDialog({ open, onOpenChange, post, onSubmit }: Props) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [status, setStatus] = useState<Post["status"]>(post?.status ?? "draft");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setTitle(post?.title ?? "");
          setExcerpt(post?.excerpt ?? "");
          setStatus(post?.status ?? "draft");
        }
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{post ? "Edit post" : "New post"}</DialogTitle>
          <DialogDescription>
            Posts are shared across every role and persist after you sign out.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Post["status"])}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!title.trim()}
            onClick={() => {
              onSubmit({ title: title.trim(), excerpt: excerpt.trim(), status });
              onOpenChange(false);
            }}
          >
            Save post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
