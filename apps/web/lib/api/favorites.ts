const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function addToFavorites(tourId: number, token: string) {
  const response = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tourId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add to favorites");
  }

  return response.json();
}

export async function removeFromFavorites(tourId: number, token: string) {
  const response = await fetch(`${API_URL}/favorites/${tourId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove from favorites");
  }
}

export async function checkIsFavorited(
  tourId: number,
  token: string,
): Promise<boolean> {
  const response = await fetch(`${API_URL}/favorites/${tourId}/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.isFavorited;
}
