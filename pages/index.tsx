import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";

export default function Home() {
  const [username, setUsername] = useState('');
  const [nameSaved, setNameSaved] = useState(false);
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("wedding_username");
    if (stored) {
      setUsername(stored);
      setNameSaved(true);
    }
    fetchApproved();
  }, []);

  const fetchApproved = async () => {
    const res = await fetch("/api/approved");
    const data = await res.json();
    setUploads(data);
  };

  const handleUpload = async () => {
    if (!file || !username) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    alert("Yükleme tamamlandı, admin onayı bekleniyor.");
    setFile(null);
  };

  const saveName = () => {
    if (username) {
      localStorage.setItem("wedding_username", username);
      setNameSaved(true);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
      <img src="/cover.jpg" className="rounded-2xl w-full mb-4" alt="Düğünümüz" />
      <h1 className="text-2xl font-bold mb-2">Düğünümüze Hoşgeldiniz</h1>
      <Button variant="outline" className="mb-4" onClick={() => router.push("/admin")}>
        Admin Girişi
      </Button>

      {!nameSaved ? (
        <div className="my-4">
          <Input placeholder="Adınız" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Button className="mt-2" onClick={saveName}>Devam Et</Button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button className="mt-2" onClick={handleUpload}>Yükle</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {uploads.map((item) => (
              <Card key={item._id}>
                <CardContent>
                  {item.mimeType.startsWith("video") ? (
                    <video src={item.url} controls className="rounded-lg" />
                  ) : (
                    <img src={item.url} className="rounded-lg" />
                  )}
                  <p className="text-sm mt-1">Yükleyen: {item.username}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
