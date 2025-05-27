"use client";

import { Container, SimpleGrid, Loader, Text } from "@mantine/core";
import { RaffleCard } from "@/components/RaffleCard";
import { useState, useEffect } from "react";
import { IRaffle } from "@/lib";
import { Api } from "@/lib/api";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

export default function Home() {
  const { user, loading: authLoading, error: authError } = useTelegramAuth();
  const [raffles, setRaffles] = useState<IRaffle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      Api.getRaffles()
        .then(setRaffles)
        .catch((err) => console.error("error loading raffles", err))
        .finally(() => setLoading(false));
    }
  }, [authLoading, user]);

  if (authLoading) return <Loader size="xl" />;

  if (authError)
    return (
      <Text color="red" size="lg" mt="xl">
        auth error {authError}
      </Text>
    );

  if (!user)
    return (
      <Text size="lg" mt="xl">
        Auth with telegram
      </Text>
    );

  if (loading) return <Loader size="xl" />;

  return (
    <Container>
      {user.first_name} {user.username}
      <SimpleGrid
        cols={1}
        spacing="lg"
        style={{ maxWidth: 400, margin: "0 auto" }}
      >
        {raffles.map((raffle) => (
          <RaffleCard key={raffle.id} raffle={raffle} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
