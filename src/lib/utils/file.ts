/**
 * Télécharge un fichier à partir d'un contenu texte
 * @param content Contenu du fichier
 * @param fileName Nom du fichier
 * @param mimeType Type MIME du fichier
 */
export function downloadFile(content: string, fileName: string, mimeType = 'text/plain') {
  // Créer un blob à partir du contenu
  const blob = new Blob([content], { type: mimeType });
  
  // Créer une URL objet pour le blob
  const url = URL.createObjectURL(blob);
  
  // Créer un élément <a> pour le téléchargement
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  
  // Ajouter l'élément au DOM, cliquer dessus, puis le supprimer
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Libérer la mémoire de l'URL objet
  URL.revokeObjectURL(url);
}

/**
 * Copie du texte dans le presse-papier
 * @param text Texte à copier
 * @returns Une promesse qui se résout lorsque le texte est copié
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Erreur lors de la copie dans le presse-papier:', err);
    throw err;
  }
}

export default {
  downloadFile,
  copyToClipboard
};
