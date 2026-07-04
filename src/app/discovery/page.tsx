import { PhaseStage } from "@/components/phase-stage";

export default function DiscoveryPage() {
  return (
    <PhaseStage
      phase="02"
      title="Keşif"
      desc="Admin ay başında hackathon listesini toplu yükler (batch import). Eşleştirme motoru her hackathon için 'hangi hackathon ve neden uygun' cevabını — en uygun mevcut projeler + eksikler + pivot önerisi — verir. Kanban ve takvim görünümü."
      faz="Faz 3"
    />
  );
}
