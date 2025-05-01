import { useState, useEffect, useMemo } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import {
  AdminSessionLayout,
  Section,
  SectionHeader,
  SectionContent,
} from './components/base';
import { Skeleton } from '@components/loading';

// At route /session/:sessionId
// States:
// 1. Lobby
// 2. Start
// 3. Playing (can still advance)
// 4. Results
function AdminSession() {
  const [lock, setLock] = useState(false);
  const { sessionId } = useParams();
  const { session, setSession } = useOutletContext();


  return (
    <AdminSessionLayout>
      <Section>
        <SectionHeader>{/* Add content */}</SectionHeader>
        <SectionContent>{/* Add content */}</SectionContent>
      </Section>

      <Section>{/* Add content */}</Section>
    </AdminSessionLayout>
  );
}

export default AdminSession;
