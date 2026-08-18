import { useState } from 'react';
import Main from './pages/Main';
import Write from './pages/Write';
import Saved from './pages/Saved';
import EntryList from './pages/EntryList';
import Detail from './pages/Detail';

export default function App() {
  const [screen, setScreen] = useState('main'); // main | write | saved | list | detail
  const [lastEntry, setLastEntry] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="frame">
      {screen === 'main' && (
        <Main
          onWrite={() => setScreen('write')}
          onList={() => setScreen('list')}
        />
      )}
      {screen === 'write' && (
        <Write
          onBack={() => setScreen('main')}
          onSaved={(entry) => {
            setLastEntry(entry);
            setScreen('saved');
          }}
        />
      )}
      {screen === 'saved' && lastEntry && (
        <Saved
          entry={lastEntry}
          onMain={() => setScreen('main')}
          onList={() => setScreen('list')}
        />
      )}
      {screen === 'list' && (
        <EntryList
          onBack={() => setScreen('main')}
          onWrite={() => setScreen('write')}
          onSelect={(id) => {
            setSelectedId(id);
            setScreen('detail');
          }}
        />
      )}
      {screen === 'detail' && selectedId && (
        <Detail entryId={selectedId} onBack={() => setScreen('list')} />
      )}
    </div>
  );
}
